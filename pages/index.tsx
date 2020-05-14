import Head from "next/head";
import Title from "xolvio-storybook-showcase/components/Title";
import CenteredContentWrapper from "xolvio-storybook-showcase/helpers/CenteredContentWrapper";
import Background from "xolvio-storybook-showcase/elements/Background";
import Sections from "xolvio-storybook-showcase/components/Sections";
import { getContentFromContentful } from "../src/contentfulLibrary";
import { useEffect, useState } from "react";

type PageData = {
  fields: {
    sections: {
      fields: {
        sections: {
          fields: { description: string; heading: string; icon: string };
        }[];
      };
    };
    title: { fields: { title: string; subheading: string } };
  };
};

const Home: React.FC<{ contentId: string }> = ({ contentId }) => {
  const [pageData, setPageData] = useState<PageData>(null);
  useEffect(() => {
    getContentFromContentful<PageData>(contentId).then(setPageData);
  }, [contentId]);

  if (!pageData) return null;

  return (
    <div className="container">
      <Head>
        <title>Production Grade Contentful Example</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <CenteredContentWrapper>
        <Background />
        <Title
          subheading={pageData.fields.title.fields.subheading}
          title={pageData.fields.title.fields.title}
        />
        <Sections
          sections={pageData.fields.sections.fields.sections.map(
            (s) => s.fields
          )}
        />
      </CenteredContentWrapper>
    </div>
  );
};

export async function getStaticProps(context) {
  return {
    props: { contentId: "3NSc2aQuip4TAQ7bEcVNh8" }, // will be passed to the page component as props
  };
}

export default Home;
