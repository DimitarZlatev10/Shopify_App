import sanitizeHtml from 'sanitize-html'

export default function sanitizeHtmlString(htmlString) {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img']); // Concatenate default allowed tags with 'img'
    
    const sanitizedHtml = sanitizeHtml(htmlString, {
        allowedTags: allowedTags,
        allowedAttributes: {
            // Allow all attributes for the 'img' tag
            'img': ['alt', 'align', 'border', 'height', 'hspace', 'longdesc', 'vspace', 'width', 'src', 'usemap', 'ismap', 'class', 'title']
        },
        allowedClasses: {} // Remove all classes
    });
    return sanitizedHtml;
}

