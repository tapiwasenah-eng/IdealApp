import { Template } from "../types";

export function getTemplatePath(template: any) {
    if ('slug' in template && template.slug) {
        return `/templates/${template.slug}`;
    }
    return `/templates/${template.id}`;
}
