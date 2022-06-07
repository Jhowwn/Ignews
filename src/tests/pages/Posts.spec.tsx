import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/stripe')
jest.mock('../../services/prismic')

const posts = [
    { slug: 'new-post', title: 'new post', excerpt: 'Post excerpt', updatedAt: '1 de junho de 2022'}
]

describe('Posts Page', () => {
    it('render correctly', () => {
        render(<Posts posts={posts}  />)

        expect(screen.getByText('new post')).toBeInTheDocument()
    })

    it('load initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'new post'}
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post excerpt'}
                            ]
                        },
                        last_publication_date: '06-01-2022'
                    }
                ]
            }) 
        }as any)
        
        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({ 
                props: {
                    posts: [{
                        slug: 'new-post', 
                        title: 'new post',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de junho de 2022'
                    }]
                }
            })
        )
    })
})