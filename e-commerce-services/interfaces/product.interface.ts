interface IProduct extends Document {
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    color: string;
}

export default IProduct;