import JSZip from 'jszip';


const RESOURCE_PACK_NAME = ""; 

const TEXTURE_PATH_IN_ZIP = `assets/minecraft/textures/item/totem.png`;


async function fetchSkinTexture(username: string): Promise<ArrayBuffer> {
    const skinApiUrl = `https://mineskin.eu/skin/${username}`; 
    
    const response = await fetch(skinApiUrl);
    
    if (!response.ok) {
        if (response.status === 404) {
             throw new Error(`User '${username}' not found or does not have a public skin.`);
        }
        throw new Error(`Error loading skin: Status ${response.status}`);
    }
    
    return await response.arrayBuffer(); 
}

async function fetchAvatarImage(username: string): Promise<ArrayBuffer> {
    const avatarApiUrl = `https://mineskin.eu/avatar/${username}/256.png`;
    
    const response = await fetch(avatarApiUrl);
    
    if (!response.ok) {
        throw new Error(`Failed to load avatar image from ${avatarApiUrl}. Status: ${response.status}`);
    }
    
    return await response.arrayBuffer(); 
}

async function fetchStaticFile(relativePath: string, type: 'text' | 'arrayBuffer'): Promise<string | ArrayBuffer> {
    const url = `/3dTotem/${relativePath}`; 
    
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load static file: ${url}. Status: ${response.status}. 
            HINT: Ensure the file is placed correctly in your '/public/3dTotem/' folder.`);
    }
    
    return type === 'text' ? await response.text() : await response.arrayBuffer();
}

function processSkinForTotemTransparency(skinArrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const blob = new Blob([skinArrayBuffer], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                URL.revokeObjectURL(url);
                return reject(new Error("Could not get 2D canvas context."));
            }

            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            canvas.toBlob((newBlob) => {
                if (!newBlob) {
                    URL.revokeObjectURL(url);
                    return reject(new Error("Failed to create Blob from Canvas."));
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    URL.revokeObjectURL(url);
                    resolve(reader.result as ArrayBuffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(newBlob);
            }, 'image/png');
        };

        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(new Error(`Image loading failed: ${e}`));
        };
        
        img.src = url;
    });
}


export async function downloadTotemPack(username: string): Promise<void> {
    if (!username) {
        alert("Please provide a username.");
        return;
    }

    const zip = new JSZip();
    
    try {
        const rawSkinData = await fetchSkinTexture(username);
        const processedSkinData = await processSkinForTotemTransparency(rawSkinData);
        
        const [packMcMetaContent, packPngData, modelJsonContent] = await Promise.all([
            fetchStaticFile('pack.mcmeta', 'text') as Promise<string>,
            fetchAvatarImage(username),
            fetchStaticFile('assets/minecraft/models/item/totem_of_undying.json', 'text') as Promise<string>
        ]);

        
        zip.file(TEXTURE_PATH_IN_ZIP, processedSkinData, { binary: true });
        
        zip.file(`pack.mcmeta`, packMcMetaContent);
        
        zip.file(`pack.png`, packPngData, { binary: true });

        zip.file(`assets/minecraft/models/item/totem_of_undying.json`, modelJsonContent);


        const zipBlob = await zip.generateAsync({ 
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });

        const downloadUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${RESOURCE_PACK_NAME}${username}.zip`; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(downloadUrl);
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        console.error("Download Error:", error);
        alert(`Error creating the resource pack: ${errorMessage}`);
    }
}