const github = 'https://github.com/nejcm/dot-to-dust' as const;

export const config = {
  appName: 'Dot to Dust',
  links: {
    bugs: `${github}/issues` as const,
    privacy: `${github}/blob/main/PRIVACY.md` as const,
    support: 'https://ko-fi.com/nejcm',
  },
} as const;
