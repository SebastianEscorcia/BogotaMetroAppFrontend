import { httpClient } from "../../helpers";

export const getAllsFaqCategorys = () => {
    return httpClient("/category-faqs");
};

export const getFaqCategoryById = (id) => {
    return httpClient(`/category-faqs/${id}`);
};

export const createFaqCategory = (categoryData) => {
    return httpClient("/category-faqs", {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
};

export const updateFaqCategory = (id, categoryData) => {
    return httpClient(`/category-faqs/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    });
};

export const deleteFaqCategory = (id) => {
    return httpClient(`/category-faqs/${id}`, {
        method: "DELETE",
    });
};