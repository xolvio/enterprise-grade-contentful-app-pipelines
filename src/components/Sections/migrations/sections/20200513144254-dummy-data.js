const {
  createSection,
} = require("../../../Section/migrations/section/20200513164925-dummy-data");

module.exports.description = "<Put your description here>";

module.exports.up = async (migration, { makeRequest }) => {
  const sections = [
    {
      id: "sectionA",
      heading: "Training",
      description:
        "Prepare your team and product for success. Team or 1-1 tuition on all aspects of test automation.",
      icon: "flipChartIcon",
    },
    {
      id: "sectionB",
      heading: "Bespoke development",
      description:
        "We help to transform systems, modernize solutions and renovate development ecosystems.",
      icon: "screenIcon",
    },
    {
      id: "sectionC",
      heading: "Modernization",
      description:
        "We can help you with your software delivery strategy to sustainably increase the productivity of your entire team and ensure you are continuously shipping valuable software to your customers.",
      icon: "shapesIcon",
    },
  ];

  const responses = await Promise.all(
    sections.map((section) =>
      createSection(migration, { makeRequest }, section)
    )
  );

  await makeRequest({
    method: "PUT",
    url: `/entries/sectionsExample`,
    data: {
      fields: {
        sections: {
          "en-US": responses.map((r) => ({
            sys: {
              type: "Link",
              linkType: "Entry",
              id: r.sys.id,
            },
          })),
        },
      },
    },
    headers: {
      "X-Contentful-Content-Type": "sections",
    },
  });
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
};
