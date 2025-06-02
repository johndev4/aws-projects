export interface Candidate {
  candidate_no: string;
  candidate_name: string;
  candidate_party: string;
}

export type BallotContent = { [key: string]: Array<Candidate> };

type VoteCategories = 'Senators' | 'Partylist';

export interface VoteCategory {
  name: VoteCategories;
  candidates: Array<string>;
}
