import Script from 'next/script';

interface SchemaMarkupProps {
    schema: object;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
    return (
        <Script
            id="schema-markup"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

