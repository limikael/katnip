//import { compile } from 'tailwindcss';
//import { build } from 'tailwindcss/lib.js'

import compile from 'tailwindcss';

export async function tailwindBuild() {
const result = await compile({
    css: '@tailwind utilities;',
    content: [
        {
            raw: '<div class="text-red-500 hover:underline"></div>',
            extension: 'html',
        }
    ],
    config: {
        theme: {
            extend: {
                colors: {
                    brand: '#1e40af'
                }
            }
        }
    }
})

//console.log(result.css) // => final compiled CSS string
console.log(result) // => final compiled CSS string
}

