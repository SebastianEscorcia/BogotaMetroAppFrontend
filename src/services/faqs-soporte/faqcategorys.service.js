import { httpClient } from "../../helpers";
export const getAllsFaqCategorys = () =>{
    return httpClient("/category-faqs");
}