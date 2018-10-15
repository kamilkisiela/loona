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
    <img src={props.img_src} style={{height: '100px'}} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.tagline}
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
  <a className="framework-link" href={props.href}>
    <div className="image">
      <img src={props.image} alt={props.name} />
    </div>
    <div className="title">{`Get started with ${props.title}`}</div>
  </a>
);

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <div className="projectDescription">
            Loona is a state management library built on top of Apollo Client.
          </div>
          <div className="projectDescription">
            Instead of having a second store for your local data, keep
            everything in just one space.
          </div>
          <br />
          <PromoSection>
            <FrameworkLink
              href={docUrl('docs/react')}
              image={imgUrl('frameworks/react.svg')}
              title="React"
            />
            <div className="promo-space" />
            <FrameworkLink
              href={docUrl('docs/angular')}
              image={imgUrl('frameworks/angular.svg')}
              title="Angular"
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
    className="features"
  >
    <GridBlock align="center" className="feature" contents={props.children} layout={props.layout} />
  </Container>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{textAlign: 'center'}}
  >
    <h2 className="projectTitle">Why to choose loona?</h2>
    <div>
      <div className="projectDescription">
        The era of second store for local data is end today, now we keeping
        everything in one space and place :)
      </div>
    </div>
  </div>
);

const Features = () => (
  <Block layout="fourColumn">
    {[
      {
        title: 'Single store',
        content:
          'Keep your remote and local data in just one space and make it a single source of truth.',
        image: imgUrl('features/flag.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Separation of concerns',
        content:
          'Loona helps you to keep every piece of your data flow separated.',
        image: imgUrl('features/solar-system.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Benefits of Apollo',
        content:
          'You get all the benefits of Apollo, like caching, offline persistence and more.',
        image: imgUrl('features/rocket.svg'),
        imageAlign: 'top',
      },
      {
        title: 'Works on Mobile',
        content: 'Works out of the box with React Native and NativeScript.',
        image: imgUrl('features/sputnik.svg'),
        imageAlign: 'top',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    return (
      <div>
        <div className="backgroundTop"></div>
        <HomeSplash />
        <div className="mainContainer">
          <FeatureCallout />
          <Features />
        </div>
        <div className="containerBottom">
          <div className="transparent"></div>
          <div className="colored"></div>
          <img className="left" src="/img/image_bottom_left.png" width="204px" height="204px"></img>
          <img className="center" src="/img/image_bottom_center.png" width="700px" height="180px"></img>
          <img className="right" src="/img/image_bottom_right.png" width="128px" height="100px"></img>
        </div>
      </div>
    );
  }
}

module.exports = Index;
