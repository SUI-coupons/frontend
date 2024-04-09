import { useForm } from "react-hook-form";
import { Datepicker } from "flowbite-react";
import { useState } from "react";

export function AddCoupon() {
  const { register, handleSubmit } = useForm();
  const [date, setDate] = useState(new Date());

  const onSubmit = (data: any) => {
    console.log(data);
    console.log(date);
  };

  return (
    <section>
      <form className="w-[40%] mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="coupon-name"
                  className="block font-medium leading-6 text-white"
                >
                  Coupon Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="coupon-name"
                    placeholder="Enter coupon name"
                    className="block w-full bg-[#222528] placeholder:text-white rounded-md"
                    {...register("coupon-name")}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="percent"
                  className="block font-medium leading-6 text-white"
                >
                  Discount (%)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="percent"
                    placeholder="10"
                    className="block w-full bg-[#222528] placeholder:text-white rounded-md"
                    {...register("percent")}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="quantity"
                  className="block font-medium leading-6 text-white"
                >
                  Number of coupon
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="quantity"
                    placeholder="10"
                    className="block w-full bg-[#222528] placeholder:text-white rounded-md"
                    {...register("quantity")}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="image"
                  className="block font-medium leading-6 text-white"
                >
                  Image Link
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    className="block w-full bg-[#222528] placeholder:text-white rounded-md"
                    {...register("image")}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="type"
                  className="block font-medium leading-6 text-white"
                >
                  Type
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="type"
                    placeholder="Household"
                    className="block w-full bg-[#222528] placeholder:text-white rounded-md"
                    {...register("type")}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="date"
                  className="block font-medium leading-6 text-white"
                >
                  Valid until
                </label>
                <Datepicker
                  id="date"
                  onSelectedDateChanged={(date) => setDate(date)}
                  theme={{
                    root: {
                      base: "bg-[#222528] text-white relative",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-[#4DA2FF] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4DA2FFDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
