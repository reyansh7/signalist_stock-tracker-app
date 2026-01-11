import { inngest } from "@/lib/inngest/client"
import { PERSONALIZED_WELCOME_EMAIL_PROMPT, NEWS_SUMMARY_EMAIL_PROMPT } from "./prompts"
import { sendWelcomeEmail, sendNewsSummaryEmail } from "../nodemailer"
import { getAllUsersForNewsEmail } from "../actions/user.actions"
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions"
import { getNews } from "../actions/finnhub.actions"
import { use } from "react"

export const sendSignUpEmail = inngest.createFunction(
    { id: "sign-up-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
    `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile)

        const response = await step.ai.infer("generate-welcome-intro", {
            model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
            body: {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt }
                        ],
                    },
                ],
            },
        })

        await step.run("send-welcome-email", async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0]
            const introText = (part && "text" in part ? part.text : null) || "Thanks for joining signalist. You now have access to personalized stock insights."
            const {data: {email, name} } = event;
            return await sendWelcomeEmail({email,name,intro: introText});
        })
        return {
            success: true,
            message: "Welcome email sent successfully."
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'daily-news-summary' },
  [ { event: 'app/send.daily.news' }, { cron: '0 12 * * *' } ],
  async ({ step }) => {
    // Step #1: Get all users for news delivery
    const users = await step.run('get-all-users',getAllUsersForNewsEmail);
        if (!users || users.length === 0) {
            return { success: false, message: 'No users found for news email.' };
        }

    // Step #2: Fetch personalized news for each user
        const userNewsData = await step.run('fetch-user-news', async () => {
            const newsPromises = users.map(async (user) => {
                try {
                    // Get user's watchlist symbols
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
          
                    // Fetch news (personalized if watchlist exists, general otherwise)
                    const news = await getNews(symbols.length > 0 ? symbols : undefined);
          
                    return {
                        user,
                        news,
                        hasWatchlist: symbols.length > 0,
                    };
                } catch (error) {
                    console.error(`Error fetching news for user ${user.email}:`, error);
                    return {
                        user,
                        news: [],
                        hasWatchlist: false,
                    };
                }
            });

            return await Promise.all(newsPromises);
        });

    // Step #3: Summarize news via AI for each user
        
            const userNewsSummaries: { user: { id?: string; email: string; name: string }, newsContent: string | null }[] = [];

            for (const { user, news } of userNewsData) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(news, null, 2));
                    // AI summarization to be implemented using `prompt` in a later step
                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
                        body: {
                            contents: [
                                {
                                    role: "user",
                                    parts: [
                                        { text: prompt }
                                    ],
                                },
                            ],
                        },
                    });

                    const part = response.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && "text" in part ? part.text : null) || 'No market news.';
                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

    // Step #4: Send emails
        const formatDateToday = new Date().toLocaleDateString();
        await step.run('send-news-emails', async () => {
            await Promise.all(
                userNewsSummaries.map(async ({ user, newsContent }) => {
                    if(!newsContent) return false;

                    return await sendNewsSummaryEmail({ email: user.email, date: formatDateToday, newsContent })
                })
            )
        });

        return { 
            success: true,
            message: 'Daily news summary process completed'
        };
  }
)

