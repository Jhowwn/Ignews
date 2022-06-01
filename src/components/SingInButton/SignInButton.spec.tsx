import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { SignInButton } from '.';

jest.mock('next-auth/react')

describe('SignInButton component', () => {
    it('renders correctly when user is not autheticated', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false] as any)

        render(
            <SignInButton />
        )
        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
    })

    it('renders correctly when user is autheticated', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: 'John Doe', email: 'jhondoe@gmail.com' }, 
                expires: 'fake-expires'
            },
        } as any);

        render(
            <SignInButton />
        )
        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})