import React from "react";
import styled from "styled-components";
import { device } from "../../helpers/device";
import { iconsMap } from "../../icons/IconsMap";
import { Section } from "../Section/Section";
export type SectionProps = {
  heading: string;
  description: string;
  icon: keyof typeof iconsMap;
};
type SectionsProps = {
  sections: SectionProps[];
};

const SectionsWrapper = styled.div`
  flex-grow: 1;
  @media ${device.tabletVertical} {
    margin-left: 50px;
  }
`;

export const Sections = ({ sections }: SectionsProps) => (
  <SectionsWrapper>
    {sections.map((section) => (
      <Section {...section} key={section.heading} />
    ))}
  </SectionsWrapper>
);
export default Sections;
