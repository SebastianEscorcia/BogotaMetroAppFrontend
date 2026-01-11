import { httpClient } from "../../helpers";
export const getFaqSupport =  () => {
    return  httpClient("/support-faqs");
};
