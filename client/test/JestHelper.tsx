import { render, RenderResult } from "react-testing-library";
import * as React from "react";

export async function renderComponent(
  component: React.ReactElement<any>
): Promise<RenderResult> {
  const container = render(component);
  await new Promise((resolve) => setTimeout(resolve, 1));
  return container;
}
