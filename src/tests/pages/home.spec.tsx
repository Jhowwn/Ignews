import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'

jest.mock('next/router')
jest.mock('next-auth/react', () => {
    return {
        useSession: () => [null, false]
    }
})
jest.mock('../../services/stripe')

describe('Home Page', () => {
    it('render correctly', () => {
        render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
    })

    it('load initial data', async () => {
        const retriveStripeMocked = jest.mocked(stripe.prices.retrieve)

        retriveStripeMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        }as any)
        
        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({ 
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})