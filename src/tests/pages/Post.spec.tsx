import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/react';

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post = { 
    slug: 'new-post', 
    title: 'new post', 
    content: '<p>Post excerpt</p>', 
    updatedAt: '1 de junho de 2022'
}

describe('Post Page', () => {
    it('render correctly', () => {
        render(<Post post={post}  />)

        expect(screen.getByText('new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    })

    it('redirect if subscription not found', async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({params: {slug: 'new post'}}as any)

        expect(response).toEqual(
            expect.objectContaining({ 
                redirect: expect.objectContaining({ 
                    destination: '/posts/preview/new post'
                })
            })
        )
    })

    it('load initial data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active'
        }as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockReturnValueOnce({
                data: {
                    title: [
                        {type: 'heading', text: 'new post'}
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post excerpt'}
                    ]
                },
                last_publication_date: '06-01-2022'
            })
        }as any)

        const response = await getServerSideProps({params: {slug: 'new-post'}}as any)

        expect(response).toEqual(
            expect.objectContaining({ 
                props: {
                    post: { 
                        slug: 'new-post',
                        title: 'new post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: '01 de junho de 2022'
                    }
                }
            })
        )
    })
})