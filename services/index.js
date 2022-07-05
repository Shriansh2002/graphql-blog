import { request, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
  const query = gql`
    query MyQuery {
        postsConnection {
          edges {
            node {
              author {
                biography
                id
                name
                picture {
                  url
                }
              }
              createdAt
              slug
              title
              excerpt
              coverImage {
                url
              }
            }
          }
        }
      }
      
    `;

  const result = await request(graphqlAPI, query);
  return result.postsConnection.edges;
};