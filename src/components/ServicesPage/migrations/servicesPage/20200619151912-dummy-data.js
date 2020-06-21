module.exports.description = "<Put your description here>";

module.exports.up = async (migration, { makeRequest }) => {
  await makeRequest({
    method: "PUT",
    url: `/entries/pageService`,
    data: {
      fields: {
        title: {
          "en-US": {
            sys: { type: "Link", linkType: "Entry", id: "titleExample" },
          },
        },
        sections: {
          "en-US": {
            sys: { type: "Link", linkType: "Entry", id: "sectionsExample" },
          },
        },
      },
    },
    headers: {
      "X-Contentful-Content-Type": "servicesPage",
    },
  });
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
};
