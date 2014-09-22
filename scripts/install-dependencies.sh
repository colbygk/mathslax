pushd node_modules/MathJax-node
git submodule init
git submodule update
#git clone https://github.com/mathjax/MathJax mathjax
#pushd mathjax
#git checkout develop
#popd

pushd batik
curl http://apache.org/dist/xmlgraphics/batik/batik-1.7-jre13.zip > batik-1.7-jre13.zip
jar xvf batik-1.7-jre13.zip
mv batik-1.7/* .
popd

popd
