export function parseTelegramData(searchParams) {
    const data = Object.fromEntries(searchParams.entries());
    return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        photo_url: data.photo_url,
        auth_date: data.auth_date,
        hash: data.hash,
    };
}
