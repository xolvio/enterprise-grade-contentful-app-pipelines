import styled, { css } from "styled-components";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ContentfulIcon } from "./ContentfulIcon";
import { useRef, useState } from "react";
import { dummyLogout, dummySSO } from "../contentfulLibrary";

const ContentfulWidgetWrapper = styled.div<{
  isWidgetOpen: boolean;
  isLoggedIn: boolean;
  isPreviewPage: boolean;
  contentType: string;
}>`
  background-color: white;
  position: fixed;
  z-index: 999;
  bottom: 2rem;
  right: 2rem;
  color: black;
  border-radius: ${({ isWidgetOpen }) => (isWidgetOpen ? "0.3rem" : "0.3rem")};
  width: ${({ isWidgetOpen, isLoggedIn }) =>
    isWidgetOpen ? "200px" : isLoggedIn ? "120px" : "40px"};
  height: ${({ isWidgetOpen, isLoggedIn, contentType }) =>
    isWidgetOpen
      ? isLoggedIn
        ? contentType === "live"
          ? "120px"
          : "180px"
        : "180px"
      : "40px"};
  box-shadow: ${({ isWidgetOpen }) =>
    isWidgetOpen
      ? "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)"
      : "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)"};
  transition: box-shadow 0.2s, width 0.2s, height 0.2s, border-radius 0.2s;
  will-change: width, height;
  transition-timing-function: ease-in;

  &:hover {
    ${({ isWidgetOpen }) =>
      !isWidgetOpen &&
      `
        cursor: pointer;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    
    `};
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${({ isWidgetOpen }) =>
    isWidgetOpen &&
    `
      justify-content: flex-start;
      padding: 1rem;
    `};

  ${({ isPreviewPage }) =>
    isPreviewPage &&
    `
      transform: translate(50%, 50%);
      bottom: 50%;
      right: 50%;
    `};
`;

const ContentfulIconWrapper = styled.div`
  margin-left: -2px;
  display: flex;
  align-items: center;

  & > span {
    font-size: 16px;
    margin-top: -3px;
    margin-left: 0.3rem;
  }
`;

const Form = styled.form`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadein 1.5s;

  & > input {
    width: 80%;
    margin-bottom: 0.5rem;
    border: 0;
    border-bottom: 1px solid #aaa;
    height: 25px;
    font-size: 13px;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const buttonLikeCss = css`
  border: 0;
  width: 80%;
  height: 40px;
  color: white;
  font-size: 13px;
  border-radius: 0.15rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }

  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Button = styled.button<{ logout?: boolean }>`
  ${buttonLikeCss};
  background-color: ${({ logout }) => (logout ? "#f05751" : "#4fb5e1")};
`;

export const Ahref = styled.a`
  ${buttonLikeCss};
  background-color: #4fb5e1;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

const WrongCredentials = styled.span`
  color: red;
  position: absolute;
  bottom: 0.5rem;
  font-size: 12px;
`;

const RadioButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 1rem;

  & > input {
    &:first-of-type {
      margin-right: 1rem;
    }
    margin-left: 0.5rem;
  }
`;

const ContentfulWidget: React.FC<{
  contentId?: string;
}> = ({ contentId }) => {
  const router = useRouter();
  const isPreviewPage = router.pathname === "/preview";
  const [isWidgetOpen, setIsWidgetOpen] = useState(isPreviewPage);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [contentType, setcontentType] = useState<"live" | "preview">(
    () => (Cookies.get("contentType") as "live" | "preview") ?? "live"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!Cookies.get("contentType")
  );
  const formRef = useRef(null);

  const onLogin = async (e: any) => {
    e.preventDefault();

    if (dummySSO(e.target.login.value, e.target.password.value)) {
      setIsLoggedIn(true);
      window.location.pathname = "/";
    } else {
      setWrongCredentials(true);
      formRef.current.login.value = "";
      formRef.current.password.value = "";
    }
  };

  const onLogout = async (e) => {
    e.preventDefault();
    dummyLogout();
    if (!isPreviewPage) window.location.pathname = "/";
    else window.location.reload();
  };

  const onContentTypeChange = (e: any) => {
    setcontentType(e.target.value);
    Cookies.set("contentType", e.target.value);
    window.location.pathname = "/";
  };

  return (
    (isPreviewPage || isLoggedIn) && (
      <ContentfulWidgetWrapper
        isPreviewPage={isPreviewPage}
        isLoggedIn={isLoggedIn}
        isWidgetOpen={isWidgetOpen}
        contentType={contentType}
      >
        <ContentfulIconWrapper onClick={() => setIsWidgetOpen((p) => !p)}>
          <ContentfulIcon />{" "}
          {isLoggedIn && !isWidgetOpen && <span>{contentType}</span>}
        </ContentfulIconWrapper>

        {isWidgetOpen && !isLoggedIn && (
          <Form ref={formRef} onSubmit={onLogin}>
            <input placeholder={"Login"} name={"login"} type="text" />
            <input placeholder={"Password"} name={"password"} type="password" />
            <Button type={"submit"}>Login</Button>
            {wrongCredentials && (
              <WrongCredentials>Wrong username or password.</WrongCredentials>
            )}
          </Form>
        )}

        {isWidgetOpen && isLoggedIn && (
          <Form onSubmit={onLogout}>
            <RadioButtonsWrapper>
              <label htmlFor="live">Live</label>
              <input
                type="radio"
                onChange={onContentTypeChange}
                checked={contentType === "live"}
                value={"live"}
                id={"live"}
              />
              <label htmlFor="preview">Preview</label>
              <input
                type="radio"
                value={"preview"}
                onChange={onContentTypeChange}
                checked={contentType === "preview"}
                id={"preview"}
              />
            </RadioButtonsWrapper>
            {contentType === "preview" && contentId && (
              <Ahref
                target="_blank"
                href={`https://app.contentful.com/spaces/${Cookies.get(
                  "previewSpaceId"
                )}/environments/${Cookies.get(
                  "previewEnvironmentId"
                )}/entries/${contentId}`}
              >
                Edit Content
              </Ahref>
            )}
            <Button logout>Logout</Button>
          </Form>
        )}
      </ContentfulWidgetWrapper>
    )
  );
};

export default ContentfulWidget;
