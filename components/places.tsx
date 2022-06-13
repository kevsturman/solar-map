import { Combobox } from "@headlessui/react";
import { Fragment } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { XCircleIcon } from "@heroicons/react/solid";
//   import {
//     Combobox,
//     ComboboxInput,
//     ComboboxPopover,
//     ComboboxList,
//     ComboboxOption,
//   } from "@reach/combobox";
//   import "@reach/combobox/styles.css";

type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};

export default function Places({ setOffice }: PlacesProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  if (!ready) {
    return <div>Loading...</div>;
  }

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const result = await getGeocode({ address: val });
    const { lat, lng } = await getLatLng(result[0]);
    setOffice({ lat, lng });
  };
  return (
    <div className="text-black">
      <Combobox
        value={value}
        onChange={(e: string) => {
          handleSelect(e);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setValue(event.target.value)}
              displayValue={(value) => `${value}`}
            />
            <Combobox.Button
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => {
                setValue("");
              }}
            >
              <XCircleIcon className="h-5 w-5 text-gray-400" />
            </Combobox.Button>
          </div>
          <Combobox.Options>
            {data.map(({ description }, index) => (
              /* Use the `active` state to conditionally style the active option. */
              /* Use the `selected` state to conditionally style the selected option. */
              <Combobox.Option key={index} value={description} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`${
                      active ? "bg-blue-500 text-white" : "bg-white text-black"
                    }`}
                  >
                    {description}
                  </li>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
