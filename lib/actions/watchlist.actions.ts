'use server';

import { connectToDatabase } from '@/database/mongoose';
import Watchlist from '@/database/models/watchlist.model';

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      console.error('Database connection not available');
      return [];
    }

    // Find user by email in the Better Auth user collection
    const user = await db.collection('user').findOne(
      { email },
      { projection: { id: 1, _id: 1 } }
    );

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return [];
    }

    const userId = user.id || user._id?.toString();
    
    if (!userId) {
      console.error('User ID not found');
      return [];
    }

    // Query watchlist by userId and return only symbols
    const watchlistItems = await Watchlist.find({ userId }).select('symbol').lean();
    
    return watchlistItems.map(item => item.symbol);
  } catch (error) {
    console.error('Error fetching watchlist symbols:', error);
    return [];
  }
};
