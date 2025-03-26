import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaLock, FaEyeSlash, FaEye, FaUpload } from "react-icons/fa";
import Image from "next/image";

// Optimise the country select comp

interface InputEleProps {
  type: string;
  id: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;

  placeholder?: string;
  label: string;
  addStyle?: string;
  errorMsg?: string;
  options?: { value: string; label: string }[];

  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

function InputEle({
  type,
  id,
  required = true,
  disabled = false,
  label,
  options = [],
  placeholder = "",
  addStyle = "",
  errorMsg = "",
  value = "",
  onChange = () => {},
}: InputEleProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setImages([...images, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  switch (type) {
    case "number":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            type={type}
            min={1900}
            max={2099}
            step={1}
            placeholder="2024"
            onChange={onChange}
          />

          <p className="text-red-500 text-base font-medium">{errorMsg}</p>
        </div>
      );
    case "gender":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <select
            className=" p-3 rounded border bg-white border-gray-400  "
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            onChange={onChange}
          >
            <option value="select">Select...</option>
            <option value="male">Male </option>
            <option value="female">Female</option>
          </select>
          <p></p>
        </div>
      );
    case "marriage":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            Marital Status
            {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <select
            className=" p-3 rounded border bg-white border-gray-400  "
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            onChange={onChange}
          >
            <option value="select">Select...</option>
            <option value="single">Single </option>
            <option value="married">Married </option>
            <option value="divorced">Divorced </option>
            <option value="widowed">Widowed </option>
          </select>
          <p></p>
        </div>
      );
    case "country":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <select
            className=" bg-white p-3 rounded border border-gray-400  "
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            onChange={onChange}
          >
            <option value="">country</option>
            <optgroup label="Asia">
              <option value="Afghanistan">Afghanistan</option>
              <option value="Armenia">Armenia</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Bhutan">Bhutan</option>
              <option value="British Indian Ocean Territory">
                British Indian Ocean Territory
              </option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Cambodia">Cambodia</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">
                Cocos (Keeling) Islands
              </option>
              <option value="Cyprus">Cyprus</option>
              <option value="Georgia">Georgia</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Israel">Israel</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Korea, North">Korea, North</option>
              <option value="Korea, South">Korea, South</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">
                Lao People's Democratic Republic
              </option>
              <option value="Lebanon">Lebanon</option>
              <option value="Macao">Macao</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Nepal">Nepal</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palestine">Palestine</option>
              <option value="Philippines">Philippines</option>
              <option value="Qatar">Qatar</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Singapore">Singapore</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Turkey (Türkiye)">Turkey (Türkiye)</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="Åland Islands">Åland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Andorra">Andorra</option>
              <option value="Austria">Austria</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Bosnia and Herzegovina">
                Bosnia and Herzegovina
              </option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Croatia">Croatia</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Estonia">Estonia</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Italy">Italy</option>
              <option value="Jersey">Jersey</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Latvia">Latvia</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macedonia North">Macedonia North</option>
              <option value="Malta">Malta</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Norway">Norway</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Romania">Romania</option>
              <option value="San Marino">San Marino</option>
              <option value="Serbia">Serbia</option>
              <option value="Serbia and Montenegro">
                Serbia and Montenegro
              </option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Spain">Spain</option>
              <option value="Svalbard and Jan Mayen">
                Svalbard and Jan Mayen
              </option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Vatican City Holy See">
                Vatican City Holy See
              </option>
            </optgroup>
            <optgroup label="Africa">
              <option value="Algeria">Algeria</option>
              <option value="Angola">Angola</option>
              <option value="Benin">Benin</option>
              <option value="Botswana">Botswana</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Central African Republic">
                Central African Republic
              </option>
              <option value="Chad">Chad</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, Democratic Republic of the">
                Congo, Democratic Republic of the
              </option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Egypt">Egypt</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Eswatini (Swaziland)">Eswatini (Swaziland)</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Ghana">Ghana</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Kenya">Kenya</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Mali">Mali</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Namibia">Namibia</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Reunion">Reunion</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Sao Tome and Principe">
                Sao Tome and Principe
              </option>
              <option value="Senegal">Senegal</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Sudan">Sudan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Togo">Togo</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Uganda">Uganda</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </optgroup>
            <optgroup label="Australia (Oceania)">
              <option value="American Samoa">American Samoa</option>
              <option value="Australia">Australia</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="Guam">Guam</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Nauru">Nauru</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">
                Northern Mariana Islands
              </option>
              <option value="Palau">Palau</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Pitcairn Islands">Pitcairn Islands</option>
              <option value="Samoa">Samoa</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
            </optgroup>
            <optgroup label="North America">
              <option value="Anguilla">Anguilla</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Aruba">Aruba</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Barbados">Barbados</option>
              <option value="Belize">Belize</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Canada">Canada</option>
              <option value="Caribbean Netherlands">
                Caribbean Netherlands
              </option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cuba">Cuba</option>
              <option value="Curaçao">Curaçao</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Martinique">Martinique</option>
              <option value="Mexico">Mexico</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Panama">Panama</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Saint Barthelemy">Saint Barthelemy</option>
              <option value="Saint Kitts and Nevis">
                Saint Kitts and Nevis
              </option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Martin">Saint Martin</option>
              <option value="Saint Pierre and Miquelon">
                Saint Pierre and Miquelon
              </option>
              <option value="Saint Vincent and the Grenadines">
                Saint Vincent and the Grenadines
              </option>
              <option value="Sint Maarten">Sint Maarten</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Turks and Caicos Islands">
                Turks and Caicos Islands
              </option>
              <option value="U.S. Outlying Islands">
                U.S. Outlying Islands
              </option>
              <option value="United States">United States</option>
              <option value="Virgin Islands, British">
                Virgin Islands, British
              </option>
              <option value="Virgin Islands, U.S">Virgin Islands, U.S</option>
            </optgroup>
            <optgroup label="Antarctica">
              <option value="Antarctica">Antarctica</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="French Southern Territories">
                French Southern Territories
              </option>
              <option value="Heard Island and Mcdonald Islands">
                Heard Island and Mcdonald Islands
              </option>
              <option value="South Georgia and the South Sandwich Islands">
                South Georgia and the South Sandwich Islands
              </option>
            </optgroup>
            <optgroup label="South America">
              <option value="Argentina">Argentina</option>
              <option value="Bolivia (Plurinational State of)">
                Bolivia (Plurinational State of)
              </option>
              <option value="Brazil">Brazil</option>
              <option value="Chile">Chile</option>
              <option value="Colombia">Colombia</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Falkland Islands (Malvinas)">
                Falkland Islands (Malvinas)
              </option>
              <option value="French Guiana">French Guiana</option>
              <option value="Guyana">Guyana</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Suriname">Suriname</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Venezuela">Venezuela</option>
            </optgroup>
          </select>
          <p></p>
        </div>
      );

    case "password":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-[.8rem] text-gray-400 text-md" />
            <input
              className=" border-gray-400 w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 "
              type={showPassword ? "text" : "password"}
              id={id}
              value={value}
              name={id}
              placeholder={placeholder}
              onChange={onChange}
              required={required}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-400 text-md focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-red-500 text-base font-medium">{errorMsg}</p>
        </div>
      );
    case "select":
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <select
            value={value}
            className=" p-3 rounded border bg-white border-gray-400  "
            name={id}
            id={id}
            required={required}
            disabled={disabled}
            onChange={onChange}
          >
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p></p>
        </div>
      );

    case "images":
      return (
        <div className={`w-full h-fit flex flex-col gap-3 ${addStyle}`}>
          <label className="text-base font-sans font-semibold" htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <div
            className="border-dashed border-2 border-gray-400 p-4 rounded flex flex-col items-center justify-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p>Drag and drop your images here, or</p>
            <input
              type="file"
              id={id}
              name={id}
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor={id}
              className="cursor-pointer mt-2 px-4 py-2 bg-primary text-white rounded"
            >
              <FaUpload className="inline mr-2" />
              Upload Images
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="w-24 h-24 relative">
                <Image
                  fill={true}
                  src={URL.createObjectURL(image)}
                  alt={`upload-${index}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
          <p className="text-red-500 text-base font-medium">{errorMsg}</p>
        </div>
      );

    case "file":
      return (
        <div className={`w-full h-fit flex flex-col gap-3 ${addStyle}`}>
          <label className="text-base font-sans font-semibold" htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <div
            className="border-dashed border-2 border-gray-400 p-4 rounded flex flex-col items-center justify-center"
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                setFiles([...files, ...Array.from(e.dataTransfer.files)]);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <p>Drag and drop your files here, or</p>
            <input
              type="file"
              id={id}
              name={id}
              accept="application/pdf"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles([...files, ...Array.from(e.target.files)]);
                }
              }}
              className="hidden"
            />
            <label
              htmlFor={id}
              className="cursor-pointer mt-2 px-4 py-2 bg-primary text-white rounded"
            >
              <FaUpload className="inline mr-2" />
              Upload Files
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {files.map((file: File, index: number) => (
              <div key={index} className="w-full">
                <p className="truncate">{file.name}</p>
              </div>
            ))}
          </div>
          <p className="text-red-500 text-base font-medium">{errorMsg}</p>
        </div>
      );

    default:
      return (
        <div className={` w-full h-fit flex flex-col gap-3 ${addStyle} `}>
          <label className=" text-base font-sans font-semibold  " htmlFor={id}>
            {label} {required ? <span className="text-red-600">*</span> : ""}
          </label>
          <input
            className=" p-3 rounded border border-gray-400  "
            placeholder={placeholder}
            name={id}
            id={id}
            value={value}
            required={required}
            disabled={disabled}
            type={type}
            onChange={onChange}
          />

          <p className="text-red-500 text-base font-medium">{errorMsg}</p>
        </div>
      );
  }
}

InputEle.propTypes = {
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  addStyle: PropTypes.string,
  placeholder: PropTypes.string,
  errorMsg: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "number",
    "date",
    "gender",
    "marriage",
    "country",
    "phone",
    "password",
    "select",
    "images",
  ]),
};
export default InputEle;
