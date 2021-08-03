import React from "react";
import crypto from 'crypto-js';
import { dict } from "../../Dict";


const ProfileCard = (props) => {
    return (
<div className="col-lg-4">
                <div className="card" style={{height: '24rem'}}>
                    <div className="card-header">Pepole to follow</div>
                  <div className="list-group card-list-group card-body-scrollable card-body-scrollable-shadow">
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          1
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/a4fb1d293bd8d3fd38352418c50fcf1369a7a87d.jpg" className="rounded" alt="Górą ty" width="40" height="40" /> 
                        </div>
                        <div className="col">
                          Górą ty
                          <div className="text-muted">
                            GOLEC UORKIESTRA,
                            Gromee,
                            Bedoes
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:41
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          2
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/f04bb6fba32e89475d9981007aff21e13745dec2.jpg" className="rounded" alt="High Life" width="40" height="40" />
                        </div>
                        <div className="col">
                          High Life
                          <div className="text-muted">
                            Daft Punk
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:21
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          3
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/c3f13b4f7a674abda9aa36fd72fa341e918c0f26.jpg" className="rounded" alt="Houdini" width="40" height="40" />
                        </div>
                        <div className="col">
                          Houdini
                          <div className="text-muted">
                            Foster The People
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:23
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          4
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/4d4ab714dfca7b9df41d4a02a2c39394ebdeb6b6.jpg" className="rounded" alt="Safe And Sound" width="40" height="40"/>
                        </div>
                        <div className="col">
                          Safe And Sound
                          <div className="text-muted">
                            Capital Cities
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:12
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          5
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/79b2422b467ad20c07576e8f8f5f2f1692ac7142.jpg" className="rounded" alt="Partied Out" width="40" height="40"/>
                        </div>
                        <div className="col">
                          Partied Out
                          <div className="text-muted">
                            Con Bro Chill
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:17
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          6
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/aac97056fc02fe02c7e95f7ff77a07c6e82f7d6e.jpg" className="rounded" alt="Runaway (U &amp; I)" width="40" height="40" />
                        </div>
                        <div className="col">
                          Runaway (U &amp; I)
                          <div className="text-muted">
                            Galantis
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:47
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          7
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/859337f0eaa49b1ad6ed76719b7c1ae26d6412c8.jpg" className="rounded" alt="Light It Up" width="40" height="40"/>
                        </div>
                        <div className="col">
                          Light It Up 
                          <div className="text-muted">
                            Major Lazer,
                            Nyla,
                            Fuse ODG
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          02:46
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          8
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/2e7357491deb8a6796ee8d9181ca9ea1f407bb5f.jpg" className="rounded" alt="Hangover" width="40" height="40" />
                        </div>
                        <div className="col">
                          Hangover
                          <div className="text-muted">
                            Taio Cruz,
                            Flo Rida
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          04:04
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          9
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/c976bfc96d5e44820e553a16a6097cd02a61fd2f.jpg" className="rounded" alt="Shape of You" width="40" height="40" />
                        </div>
                        <div className="col">
                          Shape of You
                          <div className="text-muted">
                            Ed Sheeran
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:53
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          10
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/c9a8350feee77e9345eec4155cddc96694803d1a.jpg" className="rounded" alt="Alone" width="40" height="40" />
                        </div>
                        <div className="col">
                          Alone
                          <div className="text-muted">
                            Alan Walker
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          02:41
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          11
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/fe4ee21d30450829e5b172e806b3c1e14ca1e5f3.jpg" className="rounded" alt="Langrennsfar" width="40" height="40" />
                        </div>
                        <div className="col">
                          Langrennsfar
                          <div className="text-muted">
                            Ylvis
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          02:43
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                               
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                                
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row g-2 align-items-center">
                        <div className="col-auto text-h3">
                          12
                        </div>
                        <div className="col-auto">
                          <img src="./static/tracks/f4e96086f44c4dff1758b1fc1338cd88c1b5ce9c.jpg" className="rounded" alt="Skibidi" width="40" height="40" />
                        </div>
                        <div className="col">
                          Skibidi 
                          <div className="text-muted">
                            Little Big
                          </div>
                        </div>
                        <div className="col-auto text-muted">
                          03:12
                        </div>
                        <div className="col-auto">
                          <a href="#" className="link-secondary">
                            <button className="switch-icon" data-bs-toggle="switch-icon">
                              <span className="switch-icon-a text-muted">
                               
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                              <span className="switch-icon-b text-red">
                            
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg>
                              </span>
                            </button>
                          </a>
                        </div>
                        <div className="col-auto lh-1">
                          <div className="dropdown">
                            <a href="#" className="link-secondary" data-bs-toggle="dropdown">  
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <a className="dropdown-item" href="#">
                                Action
                              </a>
                              <a className="dropdown-item" href="#">
                                Another action
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    )
}
export default ProfileCard;
