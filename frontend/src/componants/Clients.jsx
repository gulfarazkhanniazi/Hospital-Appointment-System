import { clientsData } from "../data/data";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

export default function Clients() {
  return (
    <div className="row">
      <div className="col-12 mt-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={12}
          slidesPerView={3}
          slidesPerGroup={3}
          loop={true}
          speed={1500}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            767: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            992: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
        >
          {clientsData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="tiny-slider client-testi">
                <div className="card border-0 bg-white">
                  <div className="card-body p-4 rounded shadow m-2">
                    <i className="mdi mdi-format-quote-open fs-1 text-primary"></i>
                    <p
                      className="text-muted fst-italic mb-0"
                      style={{
                        height: "8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {item.desc}
                    </p>

                    <div className="d-flex mt-4">
                      <img
                        src={item.image}
                        className="avatar avatar-md-sm rounded-circle shadow-md"
                        alt=""
                      />
                      <div className="flex-1 ms-3">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">{item.title}</small>
                      </div>
                    </div>

                    <ul className="list-unstyled mb-0 mt-3 text-warning h5">
                      {[...Array(5)].map((_, i) => (
                        <li className="list-inline-item" key={i}>
                          <i className="mdi mdi-star"></i>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
