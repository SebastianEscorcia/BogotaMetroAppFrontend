import { httpClient } from "../../helpers";

export const getFaqSupport = () => {
    return httpClient("/support-faqs");
};

export const getSupportFaqById = (id) => {
    return httpClient(`/support-faqs/${id}`);
};

export const getSupportFaqByCategory = (categoryId) => {
    return httpClient(`/support-faqs/category/${categoryId}`);
};

export const createSupportFaq = (faqData) => {
    return httpClient("/support-faqs", {
        method: "POST",
        body: JSON.stringify(faqData),
    });
};

export const updateSupportFaq = (id, faqData) => {
    return httpClient(`/support-faqs/${id}`, {
        method: "PUT",
        body: JSON.stringify(faqData),
    });
};

export const deleteSupportFaq = (id) => {
    return httpClient(`/support-faqs/${id}`, {
        method: "DELETE",
    });
};
