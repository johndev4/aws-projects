export interface ApiConfig {
  url: string;
  endpoints: {
    voting: {
      castVote: '/voting/vote/cast';
      getEncryptionKey: '/voting/encryption/public-key';
      checkIfUserHasVoted: '/voting/user/has-voted';
    };
  };
}
