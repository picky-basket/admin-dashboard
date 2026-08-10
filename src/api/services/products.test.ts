import { vi, describe, expect, it, beforeEach } from 'vitest';
import { productApiClient } from '../client.ts';
import { addProduct, updateProduct } from './products.ts';

vi.mock('../client.ts', () => ({
  productApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe('product API payloads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a stock threshold when adding a product with stock quantity', async () => {
    (productApiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { ok: true } });

    await addProduct({
      name: 'Bananas',
      price: 2.5,
      unit: 'kg',
      categoryId: 'cat-1',
      imagePath: '/images/banana.jpg',
      stockQuantity: 12,
      stockThreshold: 5
    });

    const [, body] = (productApiClient.post as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(body.toString()).toContain('stockQuantity=12');
    expect(body.toString()).toContain('stockThreshold=5');
  });

  it('updates product stock values through the product update payload', async () => {
    (productApiClient.patch as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { ok: true } });

    await updateProduct('prod-1', {
      stockQuantity: 7,
      stockThreshold: 3
    });

    const [, body] = (productApiClient.patch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(body.toString()).toContain('stockQuantity=7');
    expect(body.toString()).toContain('stockThreshold=3');
  });
});
