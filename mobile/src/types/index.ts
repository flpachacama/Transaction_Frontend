export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
  ProductCreate: undefined;
  ProductEdit: { product: Product };
};

export type Product = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};
