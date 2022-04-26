import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
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
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ marginBottom: "2em"}}
      />
      <div>
        {status === "OK" &&
          data.map(({ description }, index) => (
            <div
            style={{marginBottom: '1em', cursor: 'pointer'}}
              key={index}
              onClick={() => {
                handleSelect(description);
              }}
            >
              {description}
            </div>
          ))}
      </div>
    </div>
  );
}
