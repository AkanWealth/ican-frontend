import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



/**
 * Shuffles the elements of an array into a random order.
 * 
 * @param {any[]} array - The input array to be shuffled.
 * @returns {any[]} - A new array with the elements in random order.
 */

export function shuffleArray(array: any[]) {
  return array.map((item) => ({
      item,                // Wrap each element in an object with the original item.
      sort: Math.random(), // Add a random value for sorting.
    }))
    .sort((a, b) => a.sort - b.sort) // Sort the array based on the random `sort` value.
    .map(({ item }) => item);        // Extract and return the shuffled items.
}




/**
 * Handles navigation to a blog post's details page.
 * 
 * @param {any} router - The router instance, typically from `next/router`.
 * @param {string} id - The unique identifier of the blog post.
 * @returns {void}
 */

export const handleReadMore = (router: any, id: string) => {
  router.push(`/blog/${id}`); // Navigate to the blog post page using the provided ID.
};
