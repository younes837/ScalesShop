import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        children: true,
        products: {
          include: {
            images: true,
            priceTiers: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Update the category in your database
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return Response.json(updatedCategory);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
