export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main>
      {/* Product detail sections will be composed here in Stage 4 */}
      <p className="p-8 text-center text-gray-400">
        Product #{params.id} — Stage 4 coming soon…
      </p>
    </main>
  );
}
