import Head from "next/head";
import { getContentFromContentful } from "../../contentfulLibrary";
import { useEffect, useState } from "react";
import CenteredContentWrapper from "../../helpers/CenteredContentWrapper";
import Background from "../../elements/Background";
import Title from "../Title/Title";
import Sections from "../Sections/Sections";

type PageData = {
  fields: {
    sections: {
      fields: {
        sections: {
          fields: { description: string; heading: string; icon: any };
        }[];
      };
    };
    title: { fields: { heading: string; subheading: string } };
  };
};

const ServicesPage: React.FC<{ contentId: string }> = ({ contentId }) => {
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
          title={pageData.fields.title.fields.heading}
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
    props: { contentId: "pageService" }, // will be passed to the page component as props
  };
}

export default ServicesPage;
