import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router'
import { SubscribeButton } from '.';

jest.mock('next-auth/react')

jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false] as any)
        render(
            <SubscribeButton />
        )
        expect(screen.getByText('Subscribe')).toBeInTheDocument()
    })

    it('redirects user to sign in when not authenticad', () => {
        const signInMocked = jest.mocked(signIn as any)
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false] as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirect to posts when user already has a subscription', () => {
        const useRouterMocked = jest.mocked(useRouter)
        const useSessionMocked = jest.mocked(useSession)

        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: { 
                user: {
                    name: 'John Doe' , email: 'jhondoe@gmail.com'
                },
                activeSubscription: 'fake-active',
                expires: 'fake-expires'
            }
        }as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        }as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts');
    })
})