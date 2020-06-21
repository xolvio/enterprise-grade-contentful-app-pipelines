import styled from "styled-components";
import { iconsMap } from "../../icons/IconsMap";
import { SectionHeaderSmall, TextBody } from "../../elements/typography";
import { device } from "../../helpers/device";
import { SectionProps } from "../Sections/Sections";

export const Section = (props: SectionProps) => (
  <ServiceSectionWrapper>
    <IconWrapper>{iconsMap[props.icon]}</IconWrapper>
    <ServiceContentWrapper>
      <SectionHeaderSmall>{props.heading}</SectionHeaderSmall>
      <TextBody>{props.description}</TextBody>
    </ServiceContentWrapper>
  </ServiceSectionWrapper>
);

const ServiceSectionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.tabletVertical} {
    flex-direction: row;
    :not(:last-child) {
      border-bottom: 1px solid #eaebea;
      margin-bottom: 50px;
    }
  }
`;
const IconWrapper = styled.div`
  @media ${device.tabletVertical} {
    position: relative;
    top: -35px;
    width: 100px;
    height: 100%;
    display: block;
  }
`;
const ServiceContentWrapper = styled.div`
  text-align: center;
  @media ${device.tabletVertical} {
    margin-left: 95px;
    margin-bottom: 60px;
    text-align: left;
  }
`;
