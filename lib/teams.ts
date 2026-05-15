import { db } from "./db";

/**
 * Fetches all team IDs where the user is a member.
 * Note: Due to Astra DB Data API limitations on querying nested arrays of objects,
 * we currently fetch all teams and filter in memory.
 * 
 * @param userId - The ID of the user to find teams for
 * @returns Array of authorized team IDs
 */
export async function getAuthorizedTeamIds(userId: string): Promise<string[]> {
  const teamsColl = db.collection("teams");
  
  // Fetch all teams (optimization: only fetch members field)
  const allTeams = await teamsColl.find({}, { projection: { members: 1 } }).toArray();
  
  const userTeamIds = allTeams
    .filter(team => team.members?.some((m: any) => m.userId === userId))
    .map(team => String(team._id));
    
  return userTeamIds;
}

/**
 * Fetches all team documents where the user is a member.
 * 
 * @param userId - The ID of the user to find teams for
 * @returns Array of authorized team documents
 */
export async function getAuthorizedTeams(userId: string): Promise<any[]> {
  const teamsColl = db.collection("teams");
  
  // Fetch all teams
  const allTeams = await teamsColl.find({}).toArray();
  
  const userTeams = allTeams.filter(team => 
    team.members?.some((m: any) => m.userId === userId)
  );
    
  return userTeams;
}
