export async function subirImagenImgur(file, cliendId) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgur.com/3/image`, {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${cliendId}`
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error uploading image: ${data.data.error}`);
    } else {
        return data.data.link;
    }
}