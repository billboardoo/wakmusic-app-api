export interface OauthDto {
  id: string;
  displayName: string;
  provider: 'google' | 'naver' | 'apple';
}