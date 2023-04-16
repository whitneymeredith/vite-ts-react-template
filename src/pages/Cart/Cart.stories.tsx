import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";

import { CartFixture, ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

import { Component } from "./index";
import { cartPageLoader } from "./loader";

const CART_ID = 1;
const PRODUCT_ID_1 = 2;
const PRODUCT_ID_2 = 3;

const meta = {
  title: "pages/Cart",
  component: Component,
  parameters: {
    layout: "centered",
    reactRouter: {
      routePath: "/cart/:cartId",
      routeParams: { cartId: CART_ID },
      loader: cartPageLoader,
    },
  },
  decorators: [withRouter],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(`${host}/carts/:cartId`, (req, res, ctx) => {
          return res(
            ctx.json(
              CartFixture.createPermutation({
                id: CART_ID,
                products: [
                  { productId: PRODUCT_ID_1 },
                  { productId: PRODUCT_ID_2 },
                ],
              })
            )
          );
        }),
        rest.get(`${host}/products/:productId`, (req, res, ctx) => {
          return res(ctx.json(ProductFixture.toStructure()));
        }),
      ],
    },
  },
};
