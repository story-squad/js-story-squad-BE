exports.seed = function (knex) {
    return knex('Avatars').insert([
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer01.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer02.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer03.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer04.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer05.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer06.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer07.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer08.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer09.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer10.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer11.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer12.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer13.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer14.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer15.svg' },
      { AvatarURL: 'https://storysquad-main.s3.amazonaws.com/avatars/Swimmer16.svg' },
    ]);
  };