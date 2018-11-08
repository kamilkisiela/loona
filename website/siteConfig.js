/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Loona', // Title for your website.
  tagline: 'Application State Management done with GraphQL',
  url: 'https://loonajs.com/', // Your website URL
  baseUrl: '/', // Base URL for your project

  // Used for publishing and more
  projectName: 'loona',
  organizationName: 'kamilkisiela',

  /* path to images for header/footer */
  headerIcon: 'img/logo_header.png',
  footerIcon: 'img/logo.white.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#322e63',
    secondaryColor: '#95a0c9',
  },

  copyright: `Copyright © ${new Date().getFullYear()} The Guild`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  usePrism: true,

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // Stylesheets
  stylesheets: ['https://fonts.googleapis.com/css?family=Montserrat:800|Source+Sans+Pro:400,600,900'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  headerLinks: [
    {doc: 'react/index', label: 'React'},
    {doc: 'angular/index', label: 'Angular'},
    {href: 'https://github.com/kamilkisiela/loona', label: 'GitHub'},
    {href: 'https://medium.com/the-guild', label: 'Blog'},
    {search: true},
  ],

  editUrl: 'https://github.com/kamilkisiela/loona/edit/master/docs/',

  // Stats
  gaTrackingId: 'UA-125180910-1',

  // Open Graph and Twitter card images.
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',

  // Social Media
  twitter: true,
  twitterUsername: 'kamilkisiela',

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/kamilkisiela/loona',

  // Search
  algolia: {
    apiKey: '154ba2b5d8c9b90a80e2b0e7833c9487',
    indexName: 'loonajs',
  },

  // Analytics
  gaGtag: true,
  gaTrackingId: 'UA-128969121-5',
};

module.exports = siteConfig;
