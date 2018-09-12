/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc) {
  const baseUrl = siteConfig.baseUrl;
  return `${baseUrl}${doc}`;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

const FrameworkLink = props => (
  <a className="frameworkLink" href={props.href}>
    <div className="image">
      <img src={props.image} alt={props.title} />
    </div>
    <div className="title">{props.title}</div>
  </a>
);

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('docusaurus.svg')} />
        <div className="inner">
          <ProjectTitle />
          <div>
            Loona is a state management library built on top of Apollo Client.
          </div>
          <div>
            Instead of having a second store for your local data, keep
            everything in just one space.
          </div>
          <br />
          <PromoSection>
            <FrameworkLink
              href={docUrl('docs/angular')}
              image={imgUrl('frameworks/angular.png')}
              title="Angular docs"
            />
            <FrameworkLink
              href={docUrl('docs/react')}
              image={imgUrl('frameworks/react.png')}
              title="React docs"
            />
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = () => (
  <Block layout="fourColumn" background="light">
    {[
      {
        title: 'Single store',
        content:
          'Keep your remote and local data in just one space and make it a single source of truth.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top'
      },
      {
        title: 'Separation of concerns',
        content: 'Loona helps you to keep every piece of your data flow separated.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Benefits of Apollo',
        content: 'You get all the benefits of Apollo, like caching, offline persistence and more.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Works on Mobile',
        content: 'Works out of the box with React Native and NativeScript.',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'top',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
