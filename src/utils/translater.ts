import * as en from "../data/language-package/english.json";
import * as es from "../data/language-package/espanol.json";

type languagePackageErrors = {
  group: "errors";
  msg:
    | "queryStringMissing"
    | "queryStringLength"
    | "translateNotFound"
    | "pathParameterMissing"
    | "languageNotSupported"
    | "patternQueryStringInvalid"
    | "patternCURPInvalid";
};

type languagePackageSuccessful = {
  group: "successful";
  msg: "ok";
};

type languagePackageGeneral = {
  group: "general";
  msg: "server" | "user";
};

type languagePackageSolution = {
  group: "solution";
  msg:
    | "addPathParameter"
    | "addQueryString"
    | "languagesSupported"
    | "specificLengthQueryString"
    | "moreInformation";
};

type languagePackage = {
  general: {
    server: string;
    user: string;
  };
  errors: {
    languageNotSupported: string;
    pathParameterMissing: string;
    queryStringMissing: string;
    queryStringLength: string;
    translateNotFound: string;
    patternQueryStringInvalid: string;
    patternCURPInvalid: string;
  };
  solution: {
    addPathParameter: string;
    addQueryString: string;
    languagesSupported: string;
    specificLengthQueryString: string;
    moreInformation: string;
  };
  successful: { ok: string };
};

type languagesSupported = "es" | "en" | "default";
export const languagesSupported: languagesSupported[] = ["en", "es"];

export function getTranslate(
  language: languagesSupported,
  code:
    | languagePackageSuccessful
    | languagePackageErrors
    | languagePackageSolution
    | languagePackageGeneral,
  dynamicValue?: { code: string; value: string }[]
) {
  let languagePackage: languagePackage = en;
  if (language === "en") {
    languagePackage = en;
  } else if (language === "es") {
    languagePackage = es;
  }
  let answer = "";
  if (code.group === "errors") {
    answer = languagePackage.errors[code.msg];
  } else if (code.group === "successful") {
    answer = languagePackage.successful[code.msg];
  } else if (code.group === "solution") {
    answer = languagePackage.solution[code.msg];
  } else {
    answer = languagePackage.general[code.msg];
  }
  if (dynamicValue !== undefined) {
    dynamicValue.forEach((v) => {
      if (v.code.match(/^#{[a-zA-Z0-9]+}#$/) === null)
        throw new Error("Invalid pattern match. RegExp: /^#{[a-zA-Z0-9]+}#$/");
      if (answer.search(v.code) !== -1) {
        answer = answer.replaceAll(v.code, v.value);
      }
    });
  }
  if (answer.search(/#{[a-zA-Z0-9]+}#/) !== -1) {
    answer = answer.replaceAll(new RegExp(/#{[a-zA-Z0-9]+}#/, "g"), "err://dynamic_value_missing");
  }
  return answer;
}
