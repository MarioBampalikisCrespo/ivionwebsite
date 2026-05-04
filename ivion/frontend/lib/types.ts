export interface CategoryDTO {
  id: number;
  categoryName: string;
}

export interface ColourDTO {
  id: number;
  colourName: string;
}

export interface ProductDTO {
  id: number;
  productName: string;
  productDescription: string | null;
  productMemory: string | null;
  productStorage: string | null;
  productImage: string | null;
  productPrice: number;
  category: CategoryDTO | null;
  colour: ColourDTO | null;
}

export interface UserDTO {
  id: number;
  username: string;
  userSurnames: string;
  email: string;
}

export interface CartItemDTO {
  product: ProductDTO;
  quantity: number;
}

export interface CartDTO {
  id: number;
  total: number;
  items: CartItemDTO[];
}

export interface OrderItemDTO {
  product: ProductDTO;
  quantity: number;
  unityPrice: number;
}

export interface OrderDTO {
  id: number;
  orderState: string;
  orderDate: string;
  shipmentAddress: string;
  items: OrderItemDTO[];
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  userSurnames: string;
  email: string;
  password: string;
}
