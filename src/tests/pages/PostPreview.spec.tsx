import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')

const post = {
    slug: 'new-post',
    title: 'new post',
    content: '<p>Post excerpt</p>',
    updatedAt: '1 de junho de 2022'
}

describe('Post Preview Page', () => {
    it('render correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false] as any)
        render(<Post post={post} />)

        expect(screen.getByText('new post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirect to full post when user has subscription ', async () => {
        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: { activeSubscription: 'fake-active' },
        } as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/post/new-post')
    })

    it('load initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

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

        const response = await getStaticProps({params: {slug: 'new-post'}}as any)

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