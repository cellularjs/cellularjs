/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
  readMore?: string;
  span: number;
};

const featureList: FeatureItem[] = [
  {
    title: 'JavaScript(TypeScript)',
    image: '/img/typescript.svg',
    description: (
      <>
        With wide range of application from backend to frontend,... JavaScript(TS), as a unified language, make
        a great seamless developer experience.
      </>
    ),
    span: 7,
  },
  {
    title: 'Virtual network',
    image: '/img/virtual-network.svg',
    description: (
      <>
        Virtual network is a programmatic network, it help services work in a protocol-agnostic manner.
      </>
    ),
    readMore: '/docs/foundation/net/net-overview',
    span: 4,
  },
  {
    title: 'Modular dependency injection',
    image: '/img/module.svg',
    description: (
      <>
        Dependency injection with modular style help you write more reusable and maintainable code.
      </>
    ),
    readMore: '/docs/foundation/dependency-injection/overview',
    span: 4,
  },
  {
    title: 'Worker',
    image: '/img/service-worker.svg',
    description: (
      <>
        Virtual network and worker threads combine together make multithreading almost transparent.
      </>
    ),
    readMore: '/docs/how-to%20wiki/worker',
    span: 4,
  },
];

function Feature({ title, image, description, readMore, span }: FeatureItem) {
  return (
    <div className={clsx(`col col--${span || 2}`, 'margin-bottom--lg')}>
      <div className="text--center ">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>

      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <div>{description}</div>
        {readMore && (<Link to={readMore}>Read more...</Link>)}
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row" style={{ justifyContent: 'center' }}>
          <Feature {...featureList[0]} />
        </div>

        <div className="row" style={{ justifyContent: 'center' }}>
          {featureList.filter((_, index) => index != 0).map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
