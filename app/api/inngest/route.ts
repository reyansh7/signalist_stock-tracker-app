import {serve} from "inngest/next";
import {inngest} from "@/lib/inngest/client";
import { send } from "process";
import { sendSignUpEmail } from "@/lib/inngest/functions";
// TODO: wire this up to your Inngest client/handlers
export const {GET,POST,PUT} = serve({
    client:inngest,
    functions: [sendSignUpEmail],
});

